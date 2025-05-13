export function Card({ className = "", ...props }) {
  return <div className={`rounded-lg border bg-white text-black shadow-md ${className}`} {...props} />;
}
export function CardHeader({ className = "", ...props }) {
  return <div className={`p-6 ${className}`} {...props} />;
}
export function CardTitle({ className = "", ...props }) {
  return <h3 className={`text-xl font-semibold ${className}`} {...props} />;
}
export function CardContent({ className = "", ...props }) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}
