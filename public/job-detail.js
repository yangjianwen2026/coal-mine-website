// API 基础地址
const API_BASE = window.location.origin + '/api';

// 加载招聘详情
async function loadJobDetail() {
  try {
    // 从 URL 获取招聘 ID
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
      document.getElementById('jobDetail').innerHTML = '<p class="loading">招聘信息不存在</p>';
      return;
    }
    
    // 获取招聘详情
    const response = await fetch(`${API_BASE}/jobs/${id}`);
    const result = await response.json();
    
    if (result.success) {
      renderJobDetail(result.data);
      // 更新页面标题
      document.title = result.data.title + ' - ' + result.data.company + ' - 煤矿资讯招聘网';
    } else {
      document.getElementById('jobDetail').innerHTML = '<p class="loading">招聘信息不存在</p>';
    }
  } catch (err) {
    console.error('加载招聘详情失败:', err);
    document.getElementById('jobDetail').innerHTML = '<p class="loading">加载失败，请刷新重试</p>';
  }
}

// 渲染招聘详情
function renderJobDetail(job) {
  const jobDetail = document.getElementById('jobDetail');
  
  jobDetail.innerHTML = `
    <div class="job-detail-header">
      <h1>${job.title}</h1>
      <div class="salary">${job.salary}</div>
      <div class="job-meta">
        <p>🏢 公司：${job.company}</p>
        <p>📍 地点：${job.location}</p>
        <p>🎓 学历：${job.education}</p>
        <p>💼 经验：${job.experience}</p>
        <p>📅 发布日期：${job.date}</p>
        <p>👁️ 浏览量：${job.views}</p>
      </div>
    </div>
    
    <div class="job-section">
      <h2>📋 职位描述</h2>
      <p>${job.description}</p>
    </div>
    
    <div class="job-section">
      <h2>✅ 任职要求</h2>
      <pre>${job.requirements}</pre>
    </div>
    
    <div class="contact-info">
      <h3>📞 联系方式</h3>
      <p>${job.contact}</p>
    </div>
  `;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  loadJobDetail();
});
