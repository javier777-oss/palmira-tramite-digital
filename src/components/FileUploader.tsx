
import { useState, useRef } from "react";
import { Upload, Check, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onFileUploaded: (file: File, fileName: string) => void;
  label: string;
  description?: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  label,
  description,
  allowedTypes = ["application/pdf", "image/jpeg", "image/png"],
  maxSizeMB = 5,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validar tipo de archivo
    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        variant: "destructive",
        title: "Tipo de archivo no permitido",
        description: `Por favor sube un archivo ${allowedTypes.join(", ")}`,
      });
      return;
    }
    
    // Validar tamaño del archivo
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Archivo demasiado grande",
        description: `El archivo no debe superar los ${maxSizeMB}MB`,
      });
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulación de carga
    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 10;
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        clearInterval(interval);
        setUploading(false);
        setUploadComplete(true);
        onFileUploaded(file, fileName);
        
        toast({
          title: "Archivo cargado correctamente",
          description: fileName,
        });
      }
    }, 300);
  };

  const resetUploader = () => {
    setFile(null);
    setFileName("");
    setProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-4">
      <div className="mb-2">
        <label className="font-medium">{label}</label>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      
      {!file ? (
        <div className="flex flex-col items-center justify-center py-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Haz clic para seleccionar un archivo</p>
          <p className="text-xs text-gray-400 mt-1">
            {`Formatos permitidos: ${allowedTypes.map(t => t.split('/')[1]).join(', ')} (máx. ${maxSizeMB}MB)`}
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={allowedTypes.join(',')}
            className="hidden"
          />
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <File className="h-5 w-5 text-gray-500" />
            <span className="text-sm truncate flex-1">{fileName}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={resetUploader}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {uploadComplete ? (
            <div className="flex items-center gap-2 mt-4 text-green-600">
              <Check className="h-4 w-4" />
              <span className="text-sm">Documento cargado correctamente</span>
            </div>
          ) : (
            <>
              {uploading && <Progress value={progress} className="h-2 mt-4" />}
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 bg-palmira-600 hover:bg-palmira-700"
              >
                {uploading ? "Cargando..." : "Subir archivo"}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
