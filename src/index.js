export default {
  async fetch(request) {
    try {
      // 提取路径
      const url = new URL(request.url);
      const path = url.pathname + url.search;
      
      // 构建目标URL
      const targetUrl = `http://47.94.43.237:8000${path}`;
      
      // 直接获取内容
      const response = await fetch(targetUrl);
      
      // 返回响应
      return new Response(response.body, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': response.headers.get('Content-Type') || 'text/plain'
        }
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
};
