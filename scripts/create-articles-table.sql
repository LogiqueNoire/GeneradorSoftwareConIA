CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  content TEXT NOT NULL,
  tag VARCHAR(100),
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_time INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some sample articles
INSERT INTO articles (title, subtitle, content, tag, read_time) VALUES
('Introducción a SaaS', 'Todo lo que necesitas saber sobre Software as a Service', 'El Software as a Service (SaaS) ha revolucionado la forma en que las empresas acceden y utilizan el software. En lugar de instalar y mantener software en servidores locales, las empresas pueden acceder a aplicaciones a través de internet...', 'tecnologia', 8),
('Configuración de Sistemas', 'Guía completa para configurar tu sistema empresarial', 'La configuración adecuada de sistemas empresariales es crucial para el éxito de cualquier organización. Este artículo te guiará a través de los pasos esenciales para configurar tu sistema de manera eficiente...', 'configuracion', 12),
('Mejores Prácticas de Seguridad', 'Protege tu negocio con estas estrategias de seguridad', 'La seguridad en los sistemas empresariales no es opcional. Con el aumento de las amenazas cibernéticas, es fundamental implementar las mejores prácticas de seguridad para proteger los datos de tu empresa...', 'seguridad', 15);
