type PageHeaderProps = {
  title: string;
  text: string;
};

export function PageHeader({ title, text }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}
