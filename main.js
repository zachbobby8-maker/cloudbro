// Cloud Bros Clubs - Main Entry
// Bootstraps the app, wires UI, state, and video calling

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize core modules
  VideoCall.init();
  await AppState.init();

  // DOM references
  const signupView = document.getElementById('signup-view');
  const appView = document.getElementById('app-view');
  const signupForm = document.getElementById('signup-form');
  const navBtns = document.querySelectorAll('.nav-btn');
  const chatContainer = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const radarMap = document.getElementById('radar-map');
  const videoGrid = document.getElementById('video-grid');
  const secretsList = document.getElementById('secrets-list');
  const mastersList = document.getElementById('masters-list');
  const secretForm = document.getElementById('secret-form');
  const toggleCameraBtn = document.getElementById('toggle-camera-btn');
  const userCameraFeed = document.getElementById('user-camera-feed');
  const fabMentorship = document.getElementById('fab-mentorship');
  const adminToggle = document.getElementById('admin-toggle');
  const adminPanel = document.getElementById('admin-panel');

  const tabs = {
    'tab-chat': document.getElementById('tab-chat'),
    'tab-radar': document.getElementById('tab-radar'),
    'tab-video': document.getElementById('tab-video'),
    'tab-secrets': document.getElementById('tab-secrets'),
    'tab-masters': document.getElementById('tab-masters'),
    'tab-profile': document.getElementById('tab-profile')
  };

  let userLocation = null;
  let currentVideoCall = null;

  // ========== INITIALIZATION ==========
  if (AppState.currentUser) {
    showApp();
  } else {
    signupView.classList.add('active');
  }

  // ========== AUTH ==========
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('user-name').value.trim();
    const region = document.getElementById('user-region').value;
    const roleRadio = document.querySelector('input[name="role"]:checked');

    if (!name || !roleRadio) return;

    await AppState.login({ name, region, role: roleRadio.value });
    showApp();
  });

  function showApp() {
    signupView.classList.remove('active');
    appView.classList.add('active');

    const user = AppState.currentUser;
    document.getElementById('header-user-role').textContent = user.role === 'Pilot' ? 'SPUN MASTER' : 'SPUN ROOKIE';

    // Show admin toggle if user is admin
    if (user.isAdmin && adminToggle) {
      adminToggle.classList.remove('hidden');
    }

    UI.renderProfile(user);
    refreshAllViews();
    startSimulation();
    startOnlineCounter();
  }

  function refreshAllViews() {
    const state = AppState;
    UI.renderChat(chatContainer, state.messages, state.currentUser, state.bannedUsers, state.pinnedMessage);
    UI.renderRadar(radarMap);
    UI.renderVideoGrid(videoGrid, null, handleVideoCallClick);
    UI.renderSecrets(secretsList, state.secrets, state.currentUser, state.adminMode, handleDeleteSecret);
    UI.renderMasters(mastersList, handleMasterAction);
    if (state.adminMode) {
      UI.renderAdminPanel(adminPanel, state);
      adminPanel.classList.remove('hidden');
    } else {
      adminPanel.classList.add('hidden');
    }
    scrollChatToBottom();
  }

  // ========== STATE LISTENERS ==========
  AppState.on('newMessage', (msg) => {
    UI.addMessageToChat(chatContainer, msg, AppState.currentUser);
    if (tabs['tab-chat'].style.opacity === '1') scrollChatToBottom();
  });

  AppState.on('messagesUpdated', () => {
    UI.renderChat(chatContainer, AppState.messages, AppState.currentUser, AppState.bannedUsers, AppState.pinnedMessage);
    scrollChatToBottom();
  });

  AppState.on('secretsUpdated', () => {
    UI.renderSecrets(secretsList, AppState.secrets, AppState.currentUser, AppState.adminMode, handleDeleteSecret);
  });

  AppState.on('bansUpdated', () => {
    UI.renderChat(chatContainer, AppState.messages, AppState.currentUser, AppState.bannedUsers, AppState.pinnedMessage);
  });

  AppState.on('pinnedUpdated', () => {
    UI.renderChat(chatContainer, AppState.messages, AppState.currentUser, AppState.bannedUsers, AppState.pinnedMessage);
  });

  AppState.on('adminToggled', (isAdmin) => {
    if (isAdmin) {
      UI.renderAdminPanel(adminPanel, AppState);
      adminPanel.classList.remove('hidden');
      UI.showToast('🛡️ Admin mode activated', 'info');
    } else {
      adminPanel.classList.add('hidden');
      UI.showToast('Admin mode deactivated', 'info');
    }
    UI.renderSecrets(secretsList, AppState.secrets, AppState.currentUser, AppState.adminMode, handleDeleteSecret);
  });

  AppState.on('profileUpdated', () => {
    UI.renderProfile(AppState.currentUser);
  });

  // ========== NAVIGATION ==========
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => {
        b.classList.remove('text-sky');
        b.classList.add('text-gray-500');
      });
      btn.classList.add('text-sky');
      btn.classList.remove('text-gray-500');

      Object.values(tabs).forEach(tab => {
        tab.style.opacity = '0';
        tab.style.pointerEvents = 'none';
        tab.style.zIndex = '0';
      });

      const targetId = btn.getAttribute('data-target');
      const targetTab = tabs[targetId];

      if (targetTab) {
        targetTab.style.opacity = '1';
        targetTab.style.pointerEvents = 'auto';
        targetTab.style.zIndex = '10';

        if (targetId === 'tab-radar') requestLocation();
        if (targetId === 'tab-chat') setTimeout(scrollChatToBottom, 100);
        if (targetId === 'tab-video' && !VideoCall.localStream) {
          setTimeout(() => startCamera(), 800);
        }
      }

      if (fabMentorship) {
        fabMentorship.style.display = (targetId === 'tab-profile') ? 'none' : 'flex';
      }
    });
  });

  // ========== CHAT ==========
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || !AppState.currentUser) return;

    const msg = {
      user: AppState.currentUser,
      content: text,
      time: new Date().toISOString()
    };

    await AppState.addMessage(msg);
    chatInput.value = '';
    scrollChatToBottom();
  });

  // Enter key to send
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });

  function scrollChatToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // ========== SIMULATION ==========
  function startSimulation() {
    setInterval(() => {
      if (Math.random() < 0.3 && window.generateSimulatedChat) {
        const generated = window.generateSimulatedChat(1)[0];
        generated.time = new Date().toISOString();
        AppState.addMessage(generated);
      }
    }, 5000);
  }

  function startOnlineCounter() {
    setInterval(() => {
      AppState.onlineCount = Math.max(15, AppState.onlineCount + Math.floor(Math.random() * 7) - 3);
      const counter = document.getElementById('online-counter');
      if (counter) counter.textContent = AppState.onlineCount;
    }, 10000);
  }

  // ========== CAMERA ==========
  async function startCamera() {
    try {
      await VideoCall.startLocalCamera(userCameraFeed);
      toggleCameraBtn.textContent = 'STOP CAMERA';
      toggleCameraBtn.classList.add('!bg-red-600');
    } catch (err) {
      UI.showToast(err.message || 'Camera access denied', 'error');
    }
  }

  function stopCamera() {
    VideoCall.stopLocalCamera();
    userCameraFeed.srcObject = null;
    toggleCameraBtn.textContent = 'START CAMERA';
    toggleCameraBtn.classList.remove('!bg-red-600');
  }

  toggleCameraBtn.addEventListener('click', () => {
    if (VideoCall.localStream) {
      stopCamera();
    } else {
      startCamera();
    }
  });

  // ========== VIDEO CALL ==========
  function handleVideoCallClick(caller) {
    currentVideoCall = caller;
    UI.openVideoCallModal(caller);
  }

  document.getElementById('start-call-btn')?.addEventListener('click', async () => {
    if (!currentVideoCall) return;
    document.getElementById('close-call-modal')?.click();

    try {
      if (!VideoCall.localStream) {
        await VideoCall.startLocalCamera(userCameraFeed);
      }

      const roomId = 'room_' + Date.now();
      await VideoCall.createRoom(roomId);

      // Show in-call UI
      document.getElementById('in-call-view')?.classList.remove('hidden');
      document.getElementById('in-call-name').textContent = currentVideoCall.user.name;

      UI.showToast(`📹 Calling ${currentVideoCall.user.name}...`, 'success');
    } catch (err) {
      UI.showToast('Failed to start call: ' + err.message, 'error');
    }
  });

  document.getElementById('hangup-btn')?.addEventListener('click', () => {
    VideoCall.hangUp();
    document.getElementById('in-call-view')?.classList.add('hidden');
    UI.showToast('Call ended', 'info');
  });

  document.getElementById('mute-btn')?.addEventListener('click', function() {
    const muted = VideoCall.toggleMute();
    this.textContent = muted ? '🔇 UNMUTE' : '🔊 MUTE';
  });

  document.getElementById('video-off-btn')?.addEventListener('click', function() {
    const off = VideoCall.toggleVideo();
    this.textContent = off ? '📹 VIDEO ON' : '📹 VIDEO OFF';
  });

  // ========== RADAR ==========
  function requestLocation() {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const subtitle = document.getElementById('radar-subtitle');
        if (subtitle) subtitle.textContent = `Scanning near ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}...`;
      }, () => {});
    }
  }

  document.getElementById('close-modal')?.addEventListener('click', () => {
    const modal = document.getElementById('radar-modal');
    const content = document.getElementById('radar-modal-content');
    content.style.transform = 'scale(0.9)';
    setTimeout(() => {
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
    }, 220);
  });

  document.getElementById('modal-message-btn')?.addEventListener('click', () => {
    document.getElementById('close-modal')?.click();
    navBtns[0].click();
    chatInput.value = `@${document.getElementById('modal-name').textContent} — `;
    chatInput.focus();
  });

  // ========== SECRETS ==========
  secretForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('secret-text').value.trim();
    if (!text || !AppState.currentUser) return;

    const isAnon = document.getElementById('secret-anon').checked;

    const newSecret = {
      id: 'secret_' + Date.now(),
      from: isAnon ? 'ANONYMOUS' : AppState.currentUser.name,
      fromAvatar: AppState.currentUser.avatar,
      toMaster: ['Master Tobez', 'Master Craig'][Math.floor(Math.random() * 2)],
      confession: text,
      masterReply: Math.random() > 0.4
        ? ['The spin sees all. Come train with me, bro.', 'Noted. Many bros hide their weakness. Let\'s fix it in private session.', 'Recorded. The slam will test you. Be ready when it comes.', 'Got it. This is why we have the MM protocol. You\'re not alone, bro.'][Math.floor(Math.random() * 4)]
        : null,
      timestamp: new Date().toISOString(),
      isAnonymous: isAnon
    };

    await AppState.addSecret(newSecret);
    document.getElementById('secret-text').value = '';
    UI.showToast('✅ Your confession has been sent to the Masters.', 'success');
  });

  function handleDeleteSecret(id) {
    if (confirm('Delete this secret?')) {
      AppState.deleteSecret(id);
      UI.showToast('Secret removed', 'info');
    }
  }

  // ========== MASTERS ==========
  function handleMasterAction(master, action) {
    if (action === 'call') {
      // Open mentorship/payment modal first — user must pay $30 and get code from admin
      currentVideoCall = {
        user: { name: master.name, avatar: master.avatar, role: 'Pilot', region: 'Global' },
        status: 'MASTER SESSION',
        viewers: Math.floor(Math.random() * 500) + 100,
        pricePerMin: 30,
        thumbnail: master.avatar
      };
      // Show payment modal instead of direct call
      fabMentorship?.click();
    } else if (action === 'chat') {
      navBtns[0].click();
      chatInput.value = `@${master.name} — I want to train with you. `;
      chatInput.focus();
    }
  }

  // ========== MENTORSHIP FAB ==========
  fabMentorship?.addEventListener('click', () => {
    const modal = document.getElementById('mentorship-modal');
    const content = document.getElementById('mentorship-modal-content');
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    setTimeout(() => content.style.transform = 'scale(1)', 80);
  });

  document.getElementById('close-mentorship')?.addEventListener('click', () => {
    const modal = document.getElementById('mentorship-modal');
    const content = document.getElementById('mentorship-modal-content');
    content.style.transform = 'scale(0.9)';
    setTimeout(() => {
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
    }, 250);
  });

  // Close call modal
  document.getElementById('close-call-modal')?.addEventListener('click', () => {
    const modal = document.getElementById('call-modal');
    const content = document.getElementById('call-modal-content');
    content.style.transform = 'scale(0.92)';
    setTimeout(() => {
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
    }, 250);
  });

  // ========== ADMIN ==========
  adminToggle?.addEventListener('click', () => {
    AppState.toggleAdmin();
  });

  // Admin pin message
  document.getElementById('admin-pin-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('admin-pin-input');
    const text = input.value.trim();
    if (!text) return;
    await AppState.setPinnedMessage({ content: text, pinnedBy: AppState.currentUser.name, time: new Date().toISOString() });
    input.value = '';
    UI.showToast('📌 Message pinned', 'success');
  });

  document.getElementById('admin-unpin-btn')?.addEventListener('click', async () => {
    await AppState.clearPinnedMessage();
    UI.showToast('📌 Pin cleared', 'info');
  });

  // Admin broadcast
  document.getElementById('admin-broadcast-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('admin-broadcast-input');
    const text = input.value.trim();
    if (!text) return;

    const broadcastMsg = {
      user: {
        id: 'admin',
        name: '📢 ADMIN',
        role: 'Pilot',
        region: 'HQ',
        avatar: 'https://ui-avatars.com/api/?name=ADMIN&background=8b0000&color=ffffff&bold=true'
      },
      content: `<span class="text-yellow-400 font-heavy">📢 BROADCAST:</span> ${text}`,
      time: new Date().toISOString()
    };

    await AppState.addMessage(broadcastMsg);
    input.value = '';
    UI.showToast('📢 Broadcast sent to all bros', 'success');
  });

  // ========== LOGOUT ==========
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    VideoCall.destroy();
    await AppState.logout();
    location.reload();
  });

  // ========== PROFILE EDIT ==========
  document.getElementById('btn-edit-profile')?.addEventListener('click', () => {
    const newBio = prompt('Update your bio:', AppState.currentUser?.bio || '');
    if (newBio !== null && newBio.trim()) {
      AppState.updateProfile({ bio: newBio.trim() });
      UI.showToast('Profile updated!', 'success');
    }
  });
});
