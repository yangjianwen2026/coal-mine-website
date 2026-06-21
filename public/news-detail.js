// API 基础地址
const API_BASE = window.location.origin + '/api';

// 加载资讯详情
async function loadNewsDetail() {
  try {
    // 从 URL 获取资讯 ID
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
      document.getElementById('newsDetail').innerHTML = '<p class="loading">资讯不存在</p>';
      return;
    }
    
    // 获取资讯详情
    const response = await fetch(`${API_BASE}/news/${id}`);
    const result = await response.json();
    
    if (result.success) {
      renderNewsDetail(result.data);
      // 更新页面标题
      document.title = result.data.title + ' - 煤矿资讯招聘网';
    } else {
      document.getElementById('newsDetail').innerHTML = '<p class="loading">资讯不存在</p>';
    }
  } catch (err) {
    console.error('加载资讯详情失败:', err);
    document.getElementById('newsDetail').innerHTML = '<p class="loading">加载失败，请刷新重试</p>';
  }
}

// 渲染资讯详情
function renderNewsDetail(news) {
  const newsDetail = document.getElementById('newsDetail');
  
  // 将内容按段落分割
  const paragraphs = news.content.split('\n').filter(p => p.trim() !== '');
  
  newsDetail.innerHTML = `
    <div class="detail-header">
      <span class="tag">${news.category}</span>
      <h1>${news.title}</h1>
      <div class="detail-meta">
        <span>📅 发布日期：${news.date}</span>
        <span>📰 来源：${news.source}</span>
        <span>👁️ 浏览量：${news.views}</span>
      </div>
    </div>
    <div class="detail-content">
      ${paragraphs.map(p => `<p>${p}</p>`).join('')}
    </div>
  `;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  loadNewsDetail();
});
