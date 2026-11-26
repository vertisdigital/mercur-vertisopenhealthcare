export const Dropdown = ({
  children,
  show,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode;
  show: boolean;
  "data-testid"?: string;
}) => {
  if (!show) return null;

  return (
    <div
      className='absolute right-0 top-full mt-1 bg-primary text-primary z-30 border border-primary rounded-[16px] shadow-lg w-max min-w-[220px] overflow-hidden'
      data-testid={dataTestId ?? 'dropdown'}
    >
      {children}
    </div>
  );
};
