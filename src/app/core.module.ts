import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [FormsModule, CommonModule, RouterModule],
})
export class CoreModule {}
