import { Skeleton, Box } from "@mui/material";

interface NotificationSkeletonProps {
  count?: number;
}

export default function NotificationSkeleton({ count = 5 }: NotificationSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='messagem-item' >
          {/* Imagem */}
          <Skeleton variant="rectangular" width={110} height={90} sx={{ borderRadius: 2 }} />

          {/* Conteúdo */}
          <div className='messagem-info'>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="30%" height={18} />
          </div>

          {/* Dot not-read (simulação) */}
          {/* <Skeleton variant="circular" width={12} height={12} /> */}
        </div>
      ))}
    </>
  );
}
