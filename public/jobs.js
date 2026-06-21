// API 基础地址
const API_BASE = window.location.origin + '/api';

let currentPage = 1;
let pageSize = 10;
let totalPages = 1;

// 加载招聘列表
async function loadJobs(page = 1) {
  try {
    const location = document.getElementById('locationFilter').value;
    const keyword = document.getElementById('searchInput').value.trim();
    
    let url = `${API_BASE}/jobs?page=${page}&limit=${pageSize}`;
    if (location) url += `&location=${encodeURIComponent(location)}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      renderJobsList(result.data);
      renderPagination(result.total, page, pageSize);
    }
  } catch (err) {
    console.error('加载招聘信息失败:', err);
    document.getElementById('jobsList').innerHTML = '<p class="loading">加载失败，请刷新重试</p>';
  }
}

// 渲染招聘列表
function renderJobsList(jobs) {
  const jobsList = document.getElementById('jobsList');
  
  if (jobs.length === 0) {
    jobsList.innerHTML = '<p class="loading">暂无招聘信息</p>';
    return;
  }
  
  jobsList.innerHTML = jobs.map(item => `
    <div class="job-item" onclick="window.location.href='job-detail.html?id=${item.id}'">
      <div class="job-header">
        <h3>${item.title}</h3>
        <span class="salary">${item.salary}</span>
      </div>
      <div class="job-info">
        <p>🏢 ${item.company}</p>
        <p>📍 ${item.location}</p>
        <p>🎓 ${item.education}</p>
        <p>💼 ${item.experience}</p>
      </div>
      <div class="job-desc">
        <p>${item.description.substring(0, 100)}...</p>
      </div>
      <div class="meta">
        <span>📅 发布日期：${item.date}</span>
        <span>👁️ ${item.views} 次浏览</span>
      </div>
    </div>
  `).join('');
}

// 渲染分页
function renderPagination(total, page, limit) {
  totalPages = Math.ceil(total / limit);
  currentPage = page;
  
  const pagination = document.getElementById('pagination');
  
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let html = '<div class="pagination-controls">';
  
  // 上一页
  if (page > 1) {
    html += `<button onclick="loadJobs(${page - 1})">上一页</button>`;
  }
  
  // 页码
  for (let i = 1; i <= totalPages; i++) {
    if (i === page) {
      html += `<button class="active">${i}</button>`;
    } else {
      html += `<button onclick="loadJobs(${i})">${i}</button>`;
    }
  }
  
  // 下一页
  if (page < totalPages) {
    html += `<button onclick="loadJobs(${page + 1})">下一页</button>`;
  }
  
  html += '</div>';
  pagination.innerHTML = html;
}

// 筛选招聘信息
function filterJobs() {
  currentPage = 1;
  loadJobs(1);
}

// 搜索招聘信息
function searchJobs() {
  currentPage = 1;
  loadJobs(1);
}

// 监听回车键搜索
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchJobs();
      }
    });
  }
  
  // 加载招聘信息
  loadJobs(1);
});
