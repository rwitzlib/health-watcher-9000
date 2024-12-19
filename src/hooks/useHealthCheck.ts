import { useState, useEffect } from 'react';

export interface HealthCheckResult {
  status: 'healthy' | 'error' | 'loading';
  responseTime: number;
  lastChecked: Date;
  error?: string;
}

export interface Service {
  id: string;
  name: string;
  url: string;
}

export function useHealthCheck(service: Service, interval: number = 30000) {
  const [result, setResult] = useState<HealthCheckResult>({
    status: 'loading',
    responseTime: 0,
    lastChecked: new Date(),
  });

  useEffect(() => {
    const checkHealth = async () => {
      const startTime = performance.now();
      try {
        const response = await fetch(`${service.url}/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        if (response.ok) {
          setResult({
            status: 'healthy',
            responseTime,
            lastChecked: new Date(),
          });
        } else {
          setResult({
            status: 'error',
            responseTime,
            lastChecked: new Date(),
            error: `HTTP ${response.status}`,
          });
        }
      } catch (error) {
        setResult({
          status: 'error',
          responseTime: 0,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    // Initial check
    checkHealth();

    // Set up interval
    const intervalId = setInterval(checkHealth, interval);

    return () => clearInterval(intervalId);
  }, [service.url, interval]);

  return result;
}