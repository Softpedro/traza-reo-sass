type InsumosPlaceholderProps = {
  title: string;
  description?: string;
};

export function InsumosPlaceholder({ title, description }: InsumosPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Configuración &gt; Insumos &gt; {title}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">{description}</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Módulo en preparación. Aquí se integrará el maestro y la gestión correspondiente.
          </p>
        )}
      </div>
    </div>
  );
}
