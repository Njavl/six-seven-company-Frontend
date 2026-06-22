import Image from 'next/image';
import Link from 'next/link';
import SaveButton from '../SaveButton/SaveButton';
import { ROUTES } from '@/lib/constants/routes';
import styles from './RecipeCard.module.css';

interface RecipeCardProps {
  id: string;
  title: string;
  thumb?: string;
  time: string;
  description: string;
  calories?: number | null;
  isFavorite?: boolean;
}

export default function RecipeCard({
  id,
  title,
  thumb,
  time,
  description,
  calories,
  isFavorite = false,
}: RecipeCardProps) {
  return (
    <div className={styles.item}>
      <div className={styles.saveButtonWrapper}>
        <SaveButton recipeId={id} isFavoriteInitial={isFavorite} />
      </div>

      <div className={styles.image}>
        {thumb ? (
          <Image
            src={thumb}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.noPhoto}>No image</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.timeCont}>
            <span className={styles.timeSvg}>
              <Image src="/icons/clock.svg" alt="" width={16} height={16} />
            </span>
            <span className={styles.timeTitle}>{time} min</span>
          </div>
        </div>

        <div className={styles.descriptionContainer}>
          <p className={styles.description}>{description}</p>
          <p className={styles.calories}>
            {calories ? `${calories} cals` : '—'}
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <Link href={ROUTES.RECIPE(id)} className={styles.button}>
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
}
