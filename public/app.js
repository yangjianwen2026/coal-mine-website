// API 基础地址
const API_BASE = window.location.origin + '/api';

// 加载最新资讯
async function loadLatestNews() {
  try {
    const response = await fetch(`${API_BASE}/news?limit=6`);
    const result = await response.json();
    
    if (result.success) {
      const newsList = document.getElementById('newsList');
      newsList.innerHTML = result.data.map(item => `
        <div class="card" onclick="window.location.href='news-detail.html?id=${item.id}'">
          <span class="tag">${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.content.substring(0, 100)}...</p>
          <div class="meta">
            <span>📅 ${item.date}</span>
            <span>👁️ ${item.views} 次浏览</span>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('加载资讯失败:', err);
    document.getElementById('newsList').innerHTML = '<p class="loading">加载失败，请刷新重试</p>';
  }
}

// 加载热门招聘
async function loadLatestJobs() {
  try {
    const response = await fetch(`${API_BASE}/jobs?limit=6`);
    const result = await response.json();
    
    if (result.success) {
      const jobsList = document.getElementById('jobsList');
      jobsList.innerHTML = result.data.map(item => `
        <div class="card" onclick="window.location.href='job-detail.html?id=${item.id}'">
          <h3>${item.title}</h3>
          <p>🏢 ${item.company}</p>
          <p>📍 ${item.location}</p>
          <p>💰 ${item.salary}</p>
          <div class="meta">
            <span>📅 ${item.date}</span>
            <span>👁️ ${item.views} 次浏览</span>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('加载招聘失败:', err);
    document.getElementById('jobsList').innerHTML = '<p class="loading">加载失败，请刷新重试</p>';
  }
}

// 加载统计数据
async function loadStats() {
  try {
    const [newsRes, jobsRes] = await Promise.all([
      fetch(`${API_BASE}/news`),
      fetch(`${API_BASE}/jobs`)
    ]);
    
    const newsResult = await newsRes.json();
    const jobsResult = await jobsRes.json();
    
    if (newsResult.success && jobsResult.success) {
      document.getElementById('newsCount').textContent = newsResult.total || 0;
      document.getElementById('jobsCount').textContent = jobsResult.total || 0;
      
      // 计算企业数量（去重）
      const companies = new Set(jobsResult.data.map(j => j.company));
      document.getElementById('companiesCount').textContent = companies.size;
      
      // 计算总浏览量
      const totalViews = [...newsResult.data, ...jobsResult.data]
        .reduce((sum, item) => sum + (item.views || 0), 0);
      document.getElementById('viewsCount').textContent = totalViews;
    }
  } catch (err) {
    console.error('加载统计数据失败:', err);
  }
}

// 搜索功能
function search() {
  const keyword = document.getElementById('searchInput').value.trim();
  if (!keyword) {
    alert('请输入搜索关键词');
    return;
  }
  
  // 跳转到搜索结果页（这里简单处理，直接跳转资讯页）
  window.location.href = `news.html?keyword=${encodeURIComponent(keyword)}`;
}

// 监听回车键搜索
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        search();
      }
    });
  }
  
  // 加载数据
  loadLatestNews();
  loadLatestJobs();
  loadStats();
});
