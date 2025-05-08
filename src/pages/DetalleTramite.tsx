
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import TramiteStatusBadge from "../components/TramiteStatusBadge";
import FileUploader from "../components/FileUploader";
import { useAuth } from "../context/AuthContext";
import {
  getTramiteById,
  getTipoTramiteById,
  uploadDocumento,
} from "../services/tramiteService";
import { Tramite, Documento, TipoTramite } from "../types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Download } from "lucide-react";

const DetalleTramite = () => {
  const { id } = useParams<{ id: string }>();
  const [tramite, setTramite] = useState<Tramite | null>(null);
  const [tipoTramite, setTipoTramite] = useState<TipoTramite | null>(null);
  const [comentario, setComentario] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos del trámite
    if (id) {
      const tramiteData = getTramiteById(id);
      if (tramiteData) {
        setTramite(tramiteData);
        
        // Cargar tipo de trámite
        const tipoData = getTipoTramiteById(tramiteData.tipoTramite.split(' ')[0]);
        setTipoTramite(tipoData || null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se encontró el trámite solicitado",
        });
        navigate("/mis-tramites");
      }
    }
  }, [id, navigate, toast]);

  // Función para manejar la subida de documentos
  const handleFileUploaded = (file: File, nombreArchivo: string, tipoDoc: string) => {
    if (!user || !tramite) return;

    // Simulamos una URL para el documento
    const fileUrl = URL.createObjectURL(file);

    const documentoNuevo: Omit<Documento, 'id' | 'fechaCarga' | 'estado'> = {
      nombre: nombreArchivo,
      url: fileUrl,
      tipoDocumento: tipoDoc,
    };

    // Actualizamos el trámite con el nuevo documento
    const tramiteActualizado = uploadDocumento(tramite.id, documentoNuevo);
    setTramite(tramiteActualizado);
  };

  // Función para verificar si un tipo de documento ya está cargado
  const isDocumentoSubido = (tipoDoc: string) => {
    if (!tramite || !tramite.documentos || tramite.documentos.length === 0) {
      return false;
    }
    
    return tramite.documentos.some(doc => doc.tipoDocumento === tipoDoc);
  };

  // Función para obtener documento por tipo
  const getDocumentoPorTipo = (tipoDoc: string): Documento | undefined => {
    if (!tramite || !tramite.documentos) return undefined;
    return tramite.documentos.find(doc => doc.tipoDocumento === tipoDoc);
  };

  // Verifica si el trámite está en un estado donde no se pueden subir más documentos
  const tramiteFinalizado = tramite?.estado === 'aprobado' || tramite?.estado === 'rechazado';

  if (!tramite || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-palmira-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{tramite.tipoTramite}</h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-gray-600">
                ID: {tramite.id.substring(tramite.id.indexOf('-') + 1)}
              </p>
              <TramiteStatusBadge status={tramite.estado} />
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={() => navigate("/mis-tramites")}
          >
            Volver a mis trámites
          </Button>
        </div>

        {/* Información del trámite */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado del trámite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tramite.historial && tramite.historial.length > 0 ? (
                    <ul className="space-y-4">
                      {tramite.historial
                        .slice()
                        .reverse()
                        .map((historial, index) => (
                          <li
                            key={historial.id}
                            className={`border-l-4 pl-4 py-2 ${
                              index === 0
                                ? "border-palmira-600"
                                : "border-gray-200"
                            }`}
                          >
                            <p className="font-medium">
                              {historial.estado
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </p>
                            {historial.comentarios && (
                              <p className="text-gray-600 text-sm">
                                {historial.comentarios}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {format(new Date(historial.fecha), "PPpp", {
                                locale: es,
                              })}
                            </p>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No hay historial disponible para este trámite.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documentos requeridos */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos requeridos</CardTitle>
              </CardHeader>
              <CardContent>
                {tipoTramite && tipoTramite.documentosRequeridos ? (
                  <div className="space-y-6">
                    {tipoTramite.documentosRequeridos.map((docReq, index) => {
                      const documentoCargado = getDocumentoPorTipo(docReq.nombre);
                      const yaSubido = !!documentoCargado;
                      
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-medium">
                                {docReq.nombre}
                                {docReq.requerido && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {docReq.descripcion}
                              </p>
                            </div>
                            {yaSubido && (
                              <TramiteStatusBadge
                                status={documentoCargado.estado}
                                className="ml-2"
                              />
                            )}
                          </div>

                          {yaSubido ? (
                            <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">
                                  {documentoCargado.nombre}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Subido el{" "}
                                  {format(
                                    new Date(documentoCargado.fechaCarga),
                                    "PPp",
                                    { locale: es }
                                  )}
                                </p>
                              </div>
                              <a
                                href={documentoCargado.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-palmira-600 hover:text-palmira-800 flex items-center gap-1"
                              >
                                <Download className="h-4 w-4" />
                                <span className="text-sm">Ver documento</span>
                              </a>
                            </div>
                          ) : (
                            !tramiteFinalizado && (
                              <FileUploader
                                label="Subir documento"
                                onFileUploaded={(file, fileName) =>
                                  handleFileUploaded(file, fileName, docReq.nombre)
                                }
                              />
                            )
                          )}

                          {/* Comentarios del revisor */}
                          {yaSubido && documentoCargado.comentarios && (
                            <div className="mt-3 bg-orange-50 p-3 rounded-md border border-orange-200">
                              <p className="text-sm font-medium text-orange-800">
                                Comentarios del revisor:
                              </p>
                              <p className="text-sm text-gray-700">
                                {documentoCargado.comentarios}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No hay información disponible sobre los documentos requeridos.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Formulario de comentarios */}
            {!tramiteFinalizado && (
              <Card>
                <CardHeader>
                  <CardTitle>Añadir un comentario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="comentario">Comentario</Label>
                      <Textarea
                        id="comentario"
                        placeholder="Escriba un comentario sobre su trámite"
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      className="bg-palmira-600 hover:bg-palmira-700"
                      disabled={!comentario.trim()}
                    >
                      Enviar comentario
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Resumen del trámite */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del trámite</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium">Tipo de trámite:</dt>
                    <dd>{tramite.tipoTramite}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Fecha de creación:</dt>
                    <dd>
                      {format(new Date(tramite.fechaCreacion), "PPp", {
                        locale: es,
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Última actualización:</dt>
                    <dd>
                      {format(new Date(tramite.fechaActualizacion), "PPp", {
                        locale: es,
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium">Estado:</dt>
                    <dd>
                      <TramiteStatusBadge status={tramite.estado} />
                    </dd>
                  </div>
                  {tramite.asignado && (
                    <div>
                      <dt className="font-medium">Asignado a:</dt>
                      <dd>{tramite.asignado}</dd>
                    </div>
                  )}
                  {tramite.descripcion && (
                    <div className="pt-2">
                      <dt className="font-medium">Descripción:</dt>
                      <dd className="mt-1 text-gray-600">{tramite.descripcion}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total de documentos requeridos:</span>
                    <span className="font-medium">
                      {tipoTramite?.documentosRequeridos.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documentos cargados:</span>
                    <span className="font-medium">
                      {tramite.documentos?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documentos aprobados:</span>
                    <span className="font-medium">
                      {tramite.documentos?.filter(d => d.estado === 'aprobado').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documentos pendientes:</span>
                    <span className="font-medium">
                      {tramite.documentos?.filter(d => d.estado === 'pendiente').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documentos rechazados:</span>
                    <span className="font-medium">
                      {tramite.documentos?.filter(d => d.estado === 'rechazado').length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {tramite.estado === 'aprobado' && (
              <Card className="bg-green-50 border-green-300">
                <CardHeader>
                  <CardTitle className="text-green-800">
                    Licencia aprobada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4">
                    ¡Felicitaciones! Su solicitud de licencia ha sido aprobada.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar licencia
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DetalleTramite;
