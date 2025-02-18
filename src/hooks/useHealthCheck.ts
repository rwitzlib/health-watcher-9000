
import { useState, useEffect } from 'react';

interface HealthResponse {
  status: string;
  services: string[];
  infrastructure: string[];
}

export interface HealthCheckResult {
  status: 'healthy' | 'error' | 'loading';
  responseTime: number;
  lastChecked: Date;
  error?: string;
  services?: string[];
  infrastructure?: string[];
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
        const response = await fetch(service.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        if (response.ok) {
          const data: HealthResponse = await response.json();
          setResult({
            status: data.status === 'OK' ? 'healthy' : 'error',
            responseTime,
            lastChecked: new Date(),
            services: data.services,
            infrastructure: data.infrastructure,
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
