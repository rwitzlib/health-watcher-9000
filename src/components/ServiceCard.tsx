
import { Service, useHealthCheck } from '@/hooks/useHealthCheck';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ServiceCardProps {
  service: Service;
  onDelete: (id: string) => void;
}

export function ServiceCard({ service, onDelete }: ServiceCardProps) {
  const health = useHealthCheck(service);

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{service.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(service.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`status-pill status-${health.status}`}>
              {health.status === 'healthy' ? 'Healthy' : health.status === 'error' ? 'Error' : 'Checking...'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Response Time</span>
            <span className="font-mono">
              {health.responseTime > 0 ? `${Math.round(health.responseTime)}ms` : '-'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Checked</span>
            <span className="text-sm">
              {formatDistanceToNow(health.lastChecked, { addSuffix: true })}
            </span>
          </div>
          {health.services && health.services.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Services</span>
              <div className="flex flex-wrap gap-2">
                {health.services.map((service, index) => (
                  <span key={index} className="text-xs bg-secondary px-2 py-1 rounded">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
          {health.infrastructure && health.infrastructure.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Infrastructure</span>
              <div className="flex flex-wrap gap-2">
                {health.infrastructure.map((item, index) => (
                  <span key={index} className="text-xs bg-secondary px-2 py-1 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {health.error && (
            <div className="mt-2 text-sm text-destructive">
              {health.error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
