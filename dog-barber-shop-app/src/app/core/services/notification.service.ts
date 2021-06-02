import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';


  constructor(private snackBar: MatSnackBar) { }


  Notify(message: string, buttonString: string = 'Ok'){
    this.snackBar.open(message,buttonString, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 5000
    });
  }

  Success(message: string, buttonString: string = 'Ok'){
    this.snackBar.open(message,buttonString, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar','snackbar-success'],
      duration: 5000
    });
  }

  Warning(message: string, buttonString: string = 'Ok'){
    this.snackBar.open(message,buttonString, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar','snackbar-warning'],
      duration: 5000
    });
  }

  Error(message: string, buttonString: string = 'Ok'){
    this.snackBar.open(message,buttonString, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar','snackbar-error'],
      duration: 5000
    });
  }

}
