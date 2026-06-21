const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data')
const NEWS_FILE = path.join(DATA_DIR, 'news.json')
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json')

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// 初始化数据文件
if (!fs.existsSync(NEWS_FILE)) {
  fs.writeFileSync(NEWS_FILE, JSON.stringify([
    {
      id: 1,
      title: '国家矿山安全监察局发布最新安全规程',
      content: '为进一步强化煤矿安全管理，国家矿山安全监察局于近日发布了最新版《煤矿安全规程》，新增了智能化开采、绿色矿山建设等相关内容，将于2026年7月1日起正式实施。',
      category: '政策法规',
      source: '国家矿山安全监察局',
      date: '2026-06-20',
      views: 1250
    },
    {
      id: 2,
      title: '2026年煤矿智能化建设加速推进',
      content: '随着人工智能和物联网技术的发展，2026年我国煤矿智能化建设进入加速期。截至目前，全国已有超过60%的大型煤矿实现了部分智能化开采，预计到2027年底，这一比例将达到80%。',
      category: '行业动态',
      source: '中国煤炭报',
      date: '2026-06-18',
      views: 980
    },
    {
      id: 3,
      title: '煤矿安全生产月活动全面启动',
      content: '今年6月是第25个全国"安全生产月"，各地煤矿企业积极开展安全知识竞赛、应急演练、隐患排查等活动，进一步提高全员安全意识，筑牢安全生产防线。',
      category: '安全知识',
      source: '应急管理部',
      date: '2026-06-15',
      views: 856
    }
  ], null, 2))
}

if (!fs.existsSync(JOBS_FILE)) {
  fs.writeFileSync(JOBS_FILE, JSON.stringify([
    {
      id: 1,
      title: '采煤工程师',
      company: '神华集团',
      location: '内蒙古鄂尔多斯',
      salary: '15000-25000元/月',
      education: '本科及以上',
      experience: '3-5年',
      description: '负责采煤工作面技术管理，编制采煤作业规程，解决现场技术问题。要求熟悉综合机械化采煤工艺，具备良好的沟通协调能力。',
      requirements: '1. 采矿工程或相关专业本科及以上学历\n2. 3年以上煤矿现场工作经验\n3. 熟悉煤矿安全规程和采煤工艺\n4. 持有煤矿安全资格证书优先',
      contact: '联系人：张经理 电话：0477-1234567',
      date: '2026-06-20',
      views: 320
    },
    {
      id: 2,
      title: '安全监察员',
      company: '中煤集团',
      location: '山西太原',
      salary: '12000-18000元/月',
      education: '大专及以上',
      experience: '2-3年',
      description: '负责煤矿现场安全监督检查，发现并及时处理安全隐患，组织开展安全教育培训。',
      requirements: '1. 安全工程或相关专业\n2. 2年以上煤矿安全管理经验\n3. 熟悉煤矿安全法律法规\n4. 具备注册安全工程师资格优先',
      contact: '联系人：李主任 电话：0351-7654321',
      date: '2026-06-18',
      views: 285
    },
    {
      id: 3,
      title: '机电维修工',
      company: '兖矿能源',
      location: '山东邹城',
      salary: '8000-12000元/月',
      education: '中专及以上',
      experience: '1-3年',
      description: '负责煤矿机电设备的日常维护、保养和故障排除，确保设备正常运行。',
      requirements: '1. 机电一体化或相关专业\n2. 1年以上机电设备维修经验\n3. 熟悉煤矿机电设备\n4. 有电工证优先',
      contact: '联系人：王师傅 电话：0537-9876543',
      date: '2026-06-15',
      views: 410
    }
  ], null, 2))
}

// 读取数据
function readData(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

// 写入数据
function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

// ==================== API 接口 ====================

// 获取所有资讯
app.get('/api/news', (req, res) => {
  try {
    const news = readData(NEWS_FILE)
    const { category, keyword, page = 1, limit = 10 } = req.query
    
    let filteredNews = news
    
    // 按分类筛选
    if (category) {
      filteredNews = filteredNews.filter(n => n.category === category)
    }
    
    // 按关键词搜索
    if (keyword) {
      filteredNews = filteredNews.filter(n => 
        n.title.includes(keyword) || n.content.includes(keyword)
      )
    }
    
    // 按日期排序（最新的在前）
    filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // 分页
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedNews = filteredNews.slice(startIndex, endIndex)
    
    res.json({
      success: true,
      data: paginatedNews,
      total: filteredNews.length,
      page: parseInt(page),
      limit: parseInt(limit)
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 获取单条资讯详情
app.get('/api/news/:id', (req, res) => {
  try {
    const news = readData(NEWS_FILE)
    const item = news.find(n => n.id === parseInt(req.params.id))
    
    if (!item) {
      return res.status(404).json({ success: false, error: '资讯不存在' })
    }
    
    // 增加浏览量
    item.views += 1
    writeData(NEWS_FILE, news)
    
    res.json({ success: true, data: item })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 获取所有招聘信息
app.get('/api/jobs', (req, res) => {
  try {
    const jobs = readData(JOBS_FILE)
    const { location, keyword, page = 1, limit = 10 } = req.query
    
    let filteredJobs = jobs
    
    // 按地点筛选
    if (location) {
      filteredJobs = filteredJobs.filter(j => j.location.includes(location))
    }
    
    // 按关键词搜索
    if (keyword) {
      filteredJobs = filteredJobs.filter(j => 
        j.title.includes(keyword) || 
        j.company.includes(keyword) ||
        j.description.includes(keyword)
      )
    }
    
    // 按日期排序（最新的在前）
    filteredJobs.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // 分页
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex)
    
    res.json({
      success: true,
      data: paginatedJobs,
      total: filteredJobs.length,
      page: parseInt(page),
      limit: parseInt(limit)
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 获取单个招聘详情
app.get('/api/jobs/:id', (req, res) => {
  try {
    const jobs = readData(JOBS_FILE)
    const item = jobs.find(j => j.id === parseInt(req.params.id))
    
    if (!item) {
      return res.status(404).json({ success: false, error: '招聘信息不存在' })
    }
    
    // 增加浏览量
    item.views += 1
    writeData(JOBS_FILE, jobs)
    
    res.json({ success: true, data: item })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 添加资讯（简单版本，无鉴权）
app.post('/api/news', (req, res) => {
  try {
    const news = readData(NEWS_FILE)
    const { title, content, category, source } = req.body
    
    if (!title || !content) {
      return res.status(400).json({ success: false, error: '标题和内容不能为空' })
    }
    
    const newItem = {
      id: news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1,
      title,
      content,
      category: category || '行业动态',
      source: source || '未知来源',
      date: new Date().toISOString().split('T')[0],
      views: 0
    }
    
    news.push(newItem)
    writeData(NEWS_FILE, news)
    
    res.json({ success: true, data: newItem })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 添加招聘信息（简单版本，无鉴权）
app.post('/api/jobs', (req, res) => {
  try {
    const jobs = readData(JOBS_FILE)
    const { title, company, location, salary, description, requirements, contact } = req.body
    
    if (!title || !company) {
      return res.status(400).json({ success: false, error: '标题和公司名称不能为空' })
    }
    
    const newItem = {
      id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1,
      title,
      company,
      location: location || '待定',
      salary: salary || '面议',
      education: req.body.education || '不限',
      experience: req.body.experience || '不限',
      description: description || '',
      requirements: requirements || '',
      contact: contact || '',
      date: new Date().toISOString().split('T')[0],
      views: 0
    }
    
    jobs.push(newItem)
    writeData(JOBS_FILE, jobs)
    
    res.json({ success: true, data: newItem })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 根路径 - 返回首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '煤矿资讯招聘网站 API 正常运行', time: new Date().toISOString() })
})

// 启动服务器
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================')
  console.log('煤矿资讯招聘网站已启动！')
  console.log('端口：' + PORT)
  console.log('时间：' + new Date().toISOString())
  console.log('========================================')
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...')
  server.close(() => {
    console.log('服务器已关闭')
    process.exit(0)
  })
})
