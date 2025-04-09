export default {
  async fetch(request, env, ctx) {
    try {
      // 获取请求详情
      const url = new URL(request.url);
      const path = url.pathname + url.search;
      
      // 使用Cloudflare特殊功能尝试连接
      const response = await fetch(`http://47.94.43.237:8000${path}`, {
        method: request.method,
        headers: {
          // 伪装请求来源，避免IP直连检测
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://example.com/'
        },
        cf: {
          // 告诉Cloudflare绕过其安全检查
          cacheTtl: 0,
          cacheEverything: false,
          scrapeShield: false,
          apps: false,
          minify: false
        },
        redirect: 'follow'
      });
      
      // 直接返回响应文本
      const text = await response.text();
      
      return new Response(text, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'text/plain' // 简化内容类型
        }
      });
    } catch (error) {
      // 返回详细错误
      return new Response(`Detailed Error:\n${error.name}: ${error.message}\n\nStack: ${error.stack}`, { 
        status: 500,
        headers: {'Content-Type': 'text/plain'}
      });
    }
  }
};
