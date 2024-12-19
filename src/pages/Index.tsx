import { useState } from 'react';
import { ServiceCard } from '@/components/ServiceCard';
import { AddServiceDialog } from '@/components/AddServiceDialog';
import { Service } from '@/hooks/useHealthCheck';
import { useToast } from '@/components/ui/use-toast';

export default function Index() {
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();

  const handleAddService = (newService: Omit<Service, 'id'>) => {
    const service: Service = {
      ...newService,
      id: crypto.randomUUID(),
    };
    setServices((prev) => [...prev, service]);
    toast({
      title: 'Service Added',
      description: `Now monitoring ${service.name}`,
    });
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
    toast({
      title: 'Service Removed',
      description: 'Service has been removed from monitoring',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Health Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor the health status of your services in real-time
          </p>
        </div>
        <AddServiceDialog onAdd={handleAddService} />
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">
            No services added yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add a service to start monitoring its health status
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}
    </div>
  );
}