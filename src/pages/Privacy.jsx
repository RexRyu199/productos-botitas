function Privacy() {
  return (
    <section>
      <div className="page-header">
        <p className="section-label">Legal</p>
        <h1>Política de <span className="accent">Privacidad</span></h1>
        <p className="subtitle">Última actualización: {new Date().getFullYear()}</p>
      </div>

      <div className="privacy-content">
        {[
          {
            title: '1. Responsable del tratamiento de datos',
            text: 'Productos "Botitas", establecimiento comercial ubicado en San Luis Río Colorado, Sonora, México, es el responsable del tratamiento de los datos personales que usted proporcione a través de este sitio web.',
          },
          {
            title: '2. Datos que recopilamos',
            text: 'Únicamente recopilamos los datos que usted nos proporciona voluntariamente a través del formulario de contacto: nombre completo, correo electrónico, número de teléfono (opcional) y el mensaje que nos envía.',
          },
          {
            title: '3. Finalidad del tratamiento',
            text: 'Los datos recabados se utilizan exclusivamente para responder a sus consultas y solicitudes de información. No se utilizan para envío de publicidad sin su consentimiento.',
          },
          {
            title: '4. Compartición de datos',
            text: 'Productos Botitas no vende, alquila ni comparte sus datos personales con terceros, salvo obligación legal. El envío del formulario utiliza el servicio EmailJS, el cual procesa el mensaje para entregarlo a nuestro correo de contacto.',
          },
          {
            title: '5. Conservación de datos',
            text: 'Los datos del formulario de contacto se conservan únicamente el tiempo necesario para atender su solicitud y durante el período exigido por las disposiciones legales aplicables.',
          },
          {
            title: '6. Derechos del usuario (ARCO)',
            text: 'Conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos. Para ejercer estos derechos contáctenos a través del formulario de contacto de este sitio.',
          },
          {
            title: '7. Cookies',
            text: 'Este sitio web no utiliza cookies de rastreo ni publicidad. Únicamente pueden existir cookies técnicas necesarias para el funcionamiento de la página.',
          },
          {
            title: '8. Cambios a esta política',
            text: 'Productos "Botitas" se reserva el derecho de actualizar esta política en cualquier momento. La versión vigente estará siempre disponible en esta página.',
          },
          {
            title: '9. Contacto',
            text: 'Para cualquier duda sobre esta política de privacidad puede contactarnos a través del formulario en la sección de Contacto de este sitio web.',
          },
        ].map(section => (
          <div key={section.title} className="privacy-section">
            <h3>{section.title}</h3>
            <p>{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Privacy