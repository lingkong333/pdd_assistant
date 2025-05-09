import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 配置类型
interface HttpClientConfig {
    timeout?: number;
    proxy?: string;
    headers?: Record<string, string>;
    retryTimes?: number;
    retryDelay?: number;
}

// 响应类型
interface HttpResponse<T = any> {
    success: boolean;
    data?: T;
    headers?: Record<string, string>;
    error?: string;
    status?: number;
}

// 默认配置
const DEFAULT_CONFIG: HttpClientConfig = {
    timeout: 10000,
    retryTimes: 3,
    retryDelay: 1000
};

// User-Agent 池
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
];

// 工具函数
const getRandomUserAgent = (): string => {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
};

const randomDelay = async (min: number = 1000, max: number = 3000): Promise<void> => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
};

// 创建 axios 实例
const createAxiosInstance = (config: HttpClientConfig): AxiosInstance => {
    const instance = axios.create({
        timeout: config.timeout,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'User-Agent': getRandomUserAgent(),
            ...config.headers
        }
    });

    if (config.proxy) {
        const [host, port] = config.proxy.split(':');
        instance.defaults.proxy = { host, port: parseInt(port) };
    }

    // 请求拦截器
    instance.interceptors.request.use((config) => {
        config.headers['User-Agent'] = getRandomUserAgent();
        return config;
    });

    return instance;
};

// 重试机制
const retryRequest = async <T>(
    fn: () => Promise<AxiosResponse<T>>,
    retryTimes: number,
    retryDelay: number
): Promise<AxiosResponse<T>> => {
    try {
        return await fn();
    } catch (error) {
        if (retryTimes === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return retryRequest(fn, retryTimes - 1, retryDelay);
    }
};

// 创建 HTTP 客户端
export const createHttpClient = (config: HttpClientConfig = {}) => {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };
    const instance = createAxiosInstance(mergedConfig);

    // GET 请求
    const get = async <T = any>(url: string, requestConfig?: AxiosRequestConfig): Promise<HttpResponse<T>> => {
        await randomDelay();
        try {
            const response = await retryRequest(
                () => instance.get<T>(url, requestConfig),
                mergedConfig.retryTimes!,
                mergedConfig.retryDelay!
            );
            return {
                success: true,
                data: response.data,
                headers: response.headers as Record<string, string>,
                status: response.status
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                status: error.response?.status
            };
        }
    };

    // POST 请求
    const post = async <T = any>(url: string, data?: any, requestConfig?: AxiosRequestConfig): Promise<HttpResponse<T>> => {
        await randomDelay();
        try {
            const response = await retryRequest(
                () => instance.post<T>(url, data, requestConfig),
                mergedConfig.retryTimes!,
                mergedConfig.retryDelay!
            );
            return {
                success: true,
                data: response.data,
                headers: response.headers as Record<string, string>,
                status: response.status
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                status: error.response?.status
            };
        }
    };

    // PUT 请求
    const put = async <T = any>(url: string, data?: any, requestConfig?: AxiosRequestConfig): Promise<HttpResponse<T>> => {
        await randomDelay();
        try {
            const response = await retryRequest(
                () => instance.put<T>(url, data, requestConfig),
                mergedConfig.retryTimes!,
                mergedConfig.retryDelay!
            );
            return {
                success: true,
                data: response.data,
                headers: response.headers as Record<string, string>,
                status: response.status
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                status: error.response?.status
            };
        }
    };

    // DELETE 请求
    const del = async <T = any>(url: string, requestConfig?: AxiosRequestConfig): Promise<HttpResponse<T>> => {
        await randomDelay();
        try {
            const response = await retryRequest(
                () => instance.delete<T>(url, requestConfig),
                mergedConfig.retryTimes!,
                mergedConfig.retryDelay!
            );
            return {
                success: true,
                data: response.data,
                headers: response.headers as Record<string, string>,
                status: response.status
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
                status: error.response?.status
            };
        }
    };

    // 更新配置
    const updateConfig = (newConfig: Partial<HttpClientConfig>) => {
        Object.assign(mergedConfig, newConfig);
        if (newConfig.proxy) {
            const [host, port] = newConfig.proxy.split(':');
            instance.defaults.proxy = { host, port: parseInt(port) };
        }
        if (newConfig.headers) {
            instance.defaults.headers = {
                ...instance.defaults.headers,
                ...newConfig.headers
            };
        }
    };

    return {
        get,
        post,
        put,
        delete: del,
        updateConfig
    };
};

// 导出默认实例
export const httpClient = createHttpClient();

// 使用示例
export const examples = {
    // 基础 GET 请求示例
    async basicGet() {
        const response = await httpClient.get('https://api.example.com/data');
        if (response.success) {
            console.log('Data:', response.data);
        } else {
            console.error('Error:', response.error);
        }
    },

    // 带自定义配置的客户端示例
    async customClientExample() {
        const customClient = createHttpClient({
            timeout: 5000,
            proxy: '127.0.0.1:7890',
            retryTimes: 5,
            headers: {
                'Cookie': 'session=abc123',
                'Referer': 'https://www.example.com'
            }
        });

        // GET 请求示例
        const getResponse = await customClient.get('https://api.example.com/user/123');

        // POST 请求示例
        const postResponse = await customClient.post('https://api.example.com/users', {
            name: 'John Doe',
            email: 'john@example.com'
        });

        // PUT 请求示例
        const putResponse = await customClient.put('https://api.example.com/users/123', {
            name: 'John Updated'
        });

        // DELETE 请求示例
        const deleteResponse = await customClient.delete('https://api.example.com/users/123');
    },

    // 爬虫示例 - 获取1688商品信息
    async crawl1688Product() {
        const client = createHttpClient({
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Cache-Control': 'no-cache',
                'Cookie': 'your-cookie-here', // 替换为实际的Cookie
                'Referer': 'https://www.1688.com'
            }
        });

        const response = await client.get('https://detail.1688.com/offer/751949876973.html');
        if (response.success) {
            // 这里可以添加解析HTML的逻辑
            console.log('Product page content:', response.data);
        } else {
            console.error('Failed to fetch product:', response.error);
        }
    },

    // 带重试的请求示例
    async retryExample() {
        const client = createHttpClient({
            retryTimes: 3,
            retryDelay: 2000
        });

        const response = await client.get('https://api.example.com/unstable-endpoint');
        console.log('Response after retries:', response);
    },

    // 动态更新配置示例
    async updateConfigExample() {
        const client = createHttpClient();

        // 初始请求
        await client.get('https://api.example.com/data');

        // 更新配置
        client.updateConfig({
            proxy: '127.0.0.1:8080',
            headers: {
                'Authorization': 'Bearer new-token'
            }
        });

        // 使用新配置的请求
        await client.get('https://api.example.com/protected-data');
    },

    // 并发请求示例
    async concurrentRequests() {
        const client = createHttpClient();

        const urls = [
            'https://api.example.com/data1',
            'https://api.example.com/data2',
            'https://api.example.com/data3'
        ];

        const responses = await Promise.all(
            urls.map(url => client.get(url))
        );

        responses.forEach((response, index) => {
            if (response.success) {
                console.log(`Data ${index + 1}:`, response.data);
            } else {
                console.error(`Error ${index + 1}:`, response.error);
            }
        });
    }
};

