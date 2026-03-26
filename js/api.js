// api.js - Giao tiếp với Google Apps Script

// ✅ URL CỐ ĐỊNH - mọi máy đều dùng chung, không cần nhập lại
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzfnbYrqY5mRfoq75jHe9abUMNGKh27id1ruLMIXGZFI_U6h_nL20HuJqZUcRXOAMLJ/exec';

const API = {
  async call(data) {
    const url = GAS_URL;
    try {
      const params = new URLSearchParams();
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          if (typeof data[key] === 'object') {
            params.append(key, JSON.stringify(data[key]));
          } else {
            params.append(key, data[key]);
          }
        }
      }
      const fullUrl = url + '?' + params.toString();
      const res = await fetch(fullUrl, { method: 'GET', redirect: 'follow' });
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch(e) {
        console.error('Parse error:', text.substring(0, 200));
        return { error: 'Lỗi phản hồi server: ' + text.substring(0,100) };
      }
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
  importHocSinh: (rows) => API.call({ action: 'importHocSinh', rows: JSON.stringify(rows) }),

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

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getCurrentUser() {
  const u = sessionStorage.getItem('ktx_user');
  return u ? JSON.parse(u) : null;
}

function hasRole(...roles) {
  const u = getCurrentUser();
  return u && roles.includes(u.role);
}

// Hiển thị ngày đẹp: 2026-03-28 → 28/03/2026
function formatDateDisplay(dateStr) {
  if (!dateStr) return '-';
  if (dateStr.includes('/')) return dateStr;
  // yyyy-mm-dd → dd/mm/yyyy
  const parts = dateStr.split('-');
  if (parts.length === 3) return parts[2]+'/'+parts[1]+'/'+parts[0];
  return dateStr;
}

// Ngày hôm nay dạng dd/mm/yyyy (dùng cho label hiển thị)
function todayStr() {
  const d = new Date();
  return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear();
}

// Ngày hôm nay dạng yyyy-mm-dd (dùng cho input[type=date])
function todayISO() {
  const d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

// Hiển thị toast thông báo
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
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.display = 'none'; }, 3500);
}
