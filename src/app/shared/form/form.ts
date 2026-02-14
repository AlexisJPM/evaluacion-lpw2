import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto-service';
import { Product } from '../../model/producto';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private servicioProducto = inject(ProductoService);
  private fb = inject(FormBuilder);

  // Expresiones regulares
  reglaLetras = '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$';
  reglaNumeros = '^[0-9]+$';

  // Definición del Formulario Reactivo
  formProducto = this.fb.group({
    id: [null],
    nombre: ['', [Validators.required, Validators.pattern(this.reglaLetras)]],
    precio: [0, [Validators.required, Validators.pattern(this.reglaNumeros)]],
    stock: [0, [Validators.required, Validators.pattern(this.reglaNumeros)]],
    categoria: ['', [Validators.required, Validators.pattern(this.reglaLetras)]]
  });

  listaProductos = signal<Product[]>([]);
  editando = false;

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.servicioProducto.getProductos().subscribe(datosProductos => {
      this.listaProductos.set(datosProductos);
    });
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Desea eliminar el registro?')) {
      this.servicioProducto.deleteProduto(id).subscribe(() => {
        this.obtenerProductos();
      });
    }
  }

  seleccionarParaEditar(producto: Product) {
    this.editando = true;
    this.formProducto.patchValue(producto as any); 
  }

  guardarProducto() {
    if (this.formProducto.invalid) return;

    const productoData = this.formProducto.value as Product;

    if (this.editando && productoData.id) {
      this.servicioProducto.putProducto(productoData.id, productoData).subscribe(() => {
        this.obtenerProductos();
        this.resetear();
      });
    } else {
      this.servicioProducto.postProductos(productoData).subscribe(() => {
        this.obtenerProductos();
        this.resetear();
      });
    }
  }

  resetear() {
    this.editando = false;
    this.formProducto.reset({
      id: null,
      nombre: '',
      precio: 0,
      stock: 0,
      categoria: ''
    });
  }
}