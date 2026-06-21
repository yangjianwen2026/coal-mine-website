// API 基础地址
const API_BASE = window.location.origin + '/api';

let currentPage = 1;
let pageSize = 10;
let totalPages = 1;

// 加载资讯列表
async function loadNews(page = 1) {
  try {
    const category = document.getElementById('categoryFilter').value;
    const keyword = document.getElementById('searchInput').value.trim();
    
    let url = `${API_BASE}/news?page=${page}&limit=${pageSize}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      renderNewsList(result.data);
      renderPagination(result.total, page, pageSize);
    }
  } catch (err) {
    console.error('加载资讯失败:', err);
    document.getElementById('newsList').innerHTML = '<p class="loading">加载失败，请刷新重试</p>';
  }
}

// 渲染资讯列表
function renderNewsList(news) {
  const newsList = document.getElementById('newsList');
  
  if (news.length === 0) {
    newsList.innerHTML = '<p class="loading">暂无资讯</p>';
    return;
  }
  
  newsList.innerHTML = news.map(item => `
    <div class="news-item" onclick="window.location.href='news-detail.html?id=${item.id}'">
      <div class="news-content">
        <span class="tag">${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.content.substring(0, 150)}...</p>
        <div class="meta">
          <span>📅 ${item.date}</span>
          <span>📰 来源：${item.source}</span>
          <span>👁️ ${item.views} 次浏览</span>
        </div>
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
    html += `<button onclick="loadNews(${page - 1})">上一页</button>`;
  }
  
  // 页码
  for (let i = 1; i <= totalPages; i++) {
    if (i === page) {
      html += `<button class="active">${i}</button>`;
    } else {
      html += `<button onclick="loadNews(${i})">${i}</button>`;
    }
  }
  
  // 下一页
  if (page < totalPages) {
    html += `<button onclick="loadNews(${page + 1})">下一页</button>`;
  }
  
  html += '</div>';
  pagination.innerHTML = html;
}

// 筛选资讯
function filterNews() {
  currentPage = 1;
  loadNews(1);
}

// 搜索资讯
function searchNews() {
  currentPage = 1;
  loadNews(1);
}

// 监听回车键搜索
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchNews();
      }
    });
  }
  
  // 从 URL 获取筛选参数
  const urlParams = new URLSearchParams(window.location.search);
  const keyword = urlParams.get('keyword');
  if (keyword) {
    document.getElementById('searchInput').value = keyword;
  }
  
  // 加载资讯
  loadNews(1);
});
