// api.js - Giao tiếp với Google Apps Script

const API = {
  async call(data) {
    const url = localStorage.getItem('api_url');
    if (!url) {
      window.location.href = 'index.html';
      return;
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      return json;
    } catch (e) {
      console.error('API Error:', e);
      return { error: 'Lỗi kết nối: ' + e.message };
    }
  },

  // AUTH
  login: (username, password) => API.call({ action: 'login', username, password }),

  // USERS
  getUsers: () => API.call({ action: 'getUsers' }),
  createUser: (data) => API.call({ action: 'createUser', ...data }),
  updateUser: (data) => API.call({ action: 'updateUser', ...data }),
  deleteUser: (id) => API.call({ action: 'deleteUser', id }),

  // HOC SINH
  getHocSinh: (params={}) => API.call({ action: 'getHocSinh', ...params }),
  createHocSinh: (data) => API.call({ action: 'createHocSinh', ...data }),
  updateHocSinh: (data) => API.call({ action: 'updateHocSinh', ...data }),
  deleteHocSinh: (id) => API.call({ action: 'deleteHocSinh', id }),
  importHocSinh: (rows) => API.call({ action: 'importHocSinh', rows }),

  // DIA DIEM
  getDiaDiem: (activeOnly=false) => API.call({ action: 'getDiaDiem', activeOnly: activeOnly ? 'true' : 'false' }),
  createDiaDiem: (tinh_ten) => API.call({ action: 'createDiaDiem', tinh_ten }),
  updateDiaDiem: (data) => API.call({ action: 'updateDiaDiem', ...data }),
  deleteDiaDiem: (id) => API.call({ action: 'deleteDiaDiem', id }),

  // DANG KY
  getDangKy: (params={}) => API.call({ action: 'getDangKy', ...params }),
  createDangKy: (data) => API.call({ action: 'createDangKy', ...data }),
  updateDangKy: (data) => API.call({ action: 'updateDangKy', ...data }),
  deleteDangKy: (id) => API.call({ action: 'deleteDangKy', id }),

  // TONG HOP
  getTongHop: () => API.call({ action: 'getTongHop' }),
  createTongHop: (data) => API.call({ action: 'createTongHop', ...data }),
  huyTongHop: (data) => API.call({ action: 'huyTongHop', ...data }),

  // BAO CAO
  getBaoCao: (params) => API.call({ action: 'getBaoCao', ...params }),
};

// Helper: lấy user hiện tại
function getCurrentUser() {
  const u = sessionStorage.getItem('ktx_user');
  return u ? JSON.parse(u) : null;
}

// Helper: kiểm tra quyền
function hasRole(...roles) {
  const u = getCurrentUser();
  return u && roles.includes(u.role);
}

// Helper: format ngày dd/mm/yyyy
function formatDate(dateStr) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

// Hiển thị toast
function showToast(msg, type='success') {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.className = 'toast ' + type;
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 3000);
}

// Confirm dialog
function confirmAction(msg) {
  return confirm(msg);
}
