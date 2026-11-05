import { useParams } from 'react-router-dom';
import { PlaceholderPage } from '@/features/dev/PlaceholderPage';

/** One component for both roles: /project/:id (editor) and /r/:token (client). */
export default function ReviewPage() {
  const { id, token } = useParams<{ id: string; token: string }>();
  const isClient = token !== undefined;

  return (
    <PlaceholderPage
      titleKey={isClient ? 'pages.review' : 'pages.project'}
      param={isClient ? token : id}
    />
  );
}