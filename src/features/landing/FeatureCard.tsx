const FeatureCard = (props: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-[#C84700] via-[#BF4126] to-[#010B02] p-2 [&_svg]:stroke-primary-foreground">
      {props.icon}
    </div>

    <div className="mt-2 text-lg font-bold">{props.title}</div>

    <div className="my-3 w-8 border-t border-purple-400" />

    <div className="mt-2 text-muted-foreground">{props.children}</div>
  </div>
);

export { FeatureCard };
