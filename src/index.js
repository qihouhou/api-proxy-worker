export default {
  async fetch(request, env, ctx) {
    try {
      // 从原始请求获取路径和查询参数
      const url = new URL(request.url);
      const pathname = url.pathname.replace(/^\/+/, ''); // 移除所有开头的斜杠
      const search = url.search;
      
      // 构建新URL - 使用URL构造函数避免路径问题
      const targetUrl = new URL(`http://47.94.43.237:8000/${pathname}${search}`);
      console.log("Proxying to:", targetUrl.toString());
      
      // 简化的请求转发
      const response = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: {
          'Content-Type': request.headers.get('Content-Type') || 'application/json',
          'User-Agent': 'Cloudflare-Worker',
          'Host': '47.94.43.237:8000'
        },
        body: ['GET', 'HEAD'].includes(request.method) ? null : await request.arrayBuffer(),
      });
      
      // 返回响应，添加CORS头
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
          'Content-Type': response.headers.get('Content-Type') || 'application/json'
        }
      });
    } catch (error) {
      // 详细错误报告
      return new Response(`Proxy error: ${error.name}: ${error.message}\nStack: ${error.stack}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
