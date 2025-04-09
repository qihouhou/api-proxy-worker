export default {
  async fetch(request, env, ctx) {
    // 目标API服务器地址
    const targetUrl = "http://47.94.43.237:8000";
    
    // 获取请求的路径
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // 修复双斜杠问题
    if (pathname.startsWith('//')) {
      pathname = pathname.replace('//', '/');
    }
    
    // 构建新的目标URL
    let newUrl = targetUrl + pathname;
    
    // 保留查询参数
    const queryString = url.search;
    if (queryString) {
      newUrl += queryString;
    }
    
    // 提取原始请求的方法、标头和主体
    const method = request.method;
    const headers = new Headers(request.headers);
    const body = method === 'GET' || method === 'HEAD' ? null : await request.clone().arrayBuffer();
    
    // 创建新的请求
    const newRequest = new Request(newUrl, {
      method: method,
      headers: headers,
      body: body,
    });

    try {
      // 发送请求到目标服务器
      const response = await fetch(newRequest);
      
      // 克隆响应以便修改标头
      const newResponse = new Response(response.body, response);
      
      // 添加CORS标头允许所有来源
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      
      // 如果是OPTIONS请求，处理预检请求
      if (request.method === 'OPTIONS') {
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        newResponse.headers.set('Access-Control-Max-Age', '86400');
      }
      
      return newResponse;
    } catch (error) {
      // 错误处理
      return new Response(`Proxy error: ${error.message}`, { status: 500 });
    }
  },
};
