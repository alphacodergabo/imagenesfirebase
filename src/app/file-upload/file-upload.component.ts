import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  task: AngularFireUploadTask;
  // Monitoreo de pocentajes
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // Url de descarga
  downloadURL: Observable<string>;
  // estado de la clase Css
  isHovering: boolean;
  constructor(
    private storage: AngularFireStorage,
  ) { }

  ngOnInit(): void {
    
  }
  toggleHover(event: boolean){
    this.isHovering = event;
  }
  startUpload(event: FileList) {
    // EL objeto a subir
    const file = event.item(0);
    // Validación para solo subir imagenes
    if (file.type.split('/')[0] !== 'image') {
      console.error('Tipo de archivo no soportado :( ');
      return;
    }
    // El path a almacenar (le agregamos el tiempo para que no se repita)
    const random = Math.random() * 1000000;
    const filePath = '/ImagenesEcommerce/' + random;
    // Opcion de meta datos
    const customMetadata = { app: 'My AngularFire-powered by Ely'};
    // Método para subir las imágenes
    const task = this.storage.upload(filePath, file);
    console.log(this.task);
    // Monitoreo de avabces
    const fileRef = this.storage.ref(filePath);
    this.percentage = this.task.percentageChanges().pipe();
    this.snapshot = this.task.snapshotChanges();
    // Resultado del proceso la URL!!
    task.snapshotChanges().pipe(
          finalize(() => this.downloadURL = fileRef.getDownloadURL() )
       )
      .subscribe();
  }
  // Determinar si la tarea de subir está activo
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
