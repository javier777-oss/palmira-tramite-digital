
import { Badge } from "@/components/ui/badge";

interface TramiteStatusBadgeProps {
  status: string;
  className?: string;
}

const TramiteStatusBadge: React.FC<TramiteStatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'iniciado':
        return {
          label: 'Iniciado',
          variant: 'outline' as const,
          className: 'border-gray-400 text-gray-700',
        };
      case 'documentos_cargados':
        return {
          label: 'Documentos cargados',
          variant: 'outline' as const,
          className: 'border-blue-400 text-blue-700',
        };
      case 'en_revision':
        return {
          label: 'En revisión',
          variant: 'default' as const,
          className: 'bg-amber-500',
        };
      case 'req_documentos':
        return {
          label: 'Requiere documentos',
          variant: 'default' as const,
          className: 'bg-orange-500',
        };
      case 'aprobado':
        return {
          label: 'Aprobado',
          variant: 'default' as const,
          className: 'bg-green-500',
        };
      case 'rechazado':
        return {
          label: 'Rechazado',
          variant: 'default' as const,
          className: 'bg-red-500',
        };
      default:
        return {
          label: status,
          variant: 'outline' as const,
          className: '',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      {config.label}
    </Badge>
  );
};

export default TramiteStatusBadge;
