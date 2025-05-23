export function g(tag, props = {}, ...kids) {
  return { tag, props: props || {}, kids };
}

function pintarNodo(nodo) {
  if (typeof nodo === 'string' || typeof nodo === 'number') {
    return document.createTextNode(nodo);
  }

  const el = document.createElement(nodo.tag);

  Object.entries(nodo.props).forEach(([clave, valor]) => {
    if (clave.startsWith("al") && typeof valor === "function") {
      el.addEventListener(clave.slice(2).toLowerCase(), valor);
    } else if (clave === "estilo" && typeof valor === "object") {
      Object.assign(el.style, valor);
    } else {
      el.setAttribute(clave, valor);
    }
  });

  nodo.kids.flat().forEach(kid => {
    el.appendChild(pintarNodo(kid));
  });

  return el;
}

export function montar(componente, contenedor) {
  contenedor.innerHTML = '';
  contenedor.appendChild(pintarNodo(componente()));
}

export function chispa(valorInicial) {
  let valor = valorInicial;
  const leer = () => valor;
  const actualizar = nuevoValor => {
    valor = nuevoValor;
    _refrescar();
  };
  return [leer, actualizar];
}

let _raiz = null;
let _contenedor = null;

function _refrescar() {
  if (_raiz && _contenedor) {
    montar(_raiz, _contenedor);
  }
}

export function iniciar(componenteRaiz, contenedor) {
  _raiz = componenteRaiz;
  _contenedor = contenedor;
  montar(componenteRaiz, contenedor);
}