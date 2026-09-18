export function renderMissingConfig(root) {
  root.innerHTML = `
    <div class="config-screen">
      <div class="config-card">
        <h1>Cuaderno</h1>
        <p>Todavía falta conectar Firebase para poder iniciar sesión y guardar tus notas.</p>
        <p>Copiá <code>.env.example</code> a <code>.env</code>, completá tus credenciales de Firebase
        y volvé a levantar la app. Los pasos completos están en el <code>README.md</code>.</p>
      </div>
    </div>
  `;
}
