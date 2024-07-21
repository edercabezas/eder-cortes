import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-info',
  standalone: true,
    imports: [
        MatButton
    ],
  templateUrl: './modal-info.component.html',
  styleUrl: './modal-info.component.scss'
})
export class ModalInfoComponent implements OnInit{
  @Output() clickConfirm = new EventEmitter<any>();

  constructor(public dialogRef: MatDialogRef<ModalInfoComponent>,
              @Inject(MAT_DIALOG_DATA) public dataInformation: any,) {
  }

  ngOnInit(): void {
        console.log(this.dataInformation)
    }




  onNoClick(): void {
    this.dialogRef.close(false);
  }

  public returnConfirm(): void {
    this.dialogRef.close(true);
  }

}
