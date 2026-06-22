import Image from 'next/image';
import Link from 'next/link';
import SaveButton from '../SaveButton/SaveButton';
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
      {/* Кнопка збереження */}
      <div className={styles.saveButtonWrapper}>
        <SaveButton recipeId={id} isFavoriteInitial={isFavorite} />
      </div>

      {/* Зображення */}
      <div className={styles.image}>
        {thumb ? (
          <Image
            src={thumb}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.noPhoto}>
            Немає фото
          </div>
        )}
      </div>

      {/* Контент */}
      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.timeCont}>
            <span className={styles.timeSvg}>
              <Image src="/icons/clock.svg" alt="Clock" width={16} height={16} />
            </span>
            <span className={styles.timeTitle}>{time} хв</span>
          </div>
        </div>

        <div className={styles.descriptionContainer}>
          <p className={styles.description}>{description}</p>
          <p className={styles.calories}>{calories ? `${calories} ккал` : '—'}</p>
        </div>

        <div className={styles.buttonContainer}>
          <Link href={`/recipes/${id}`} className={styles.button}>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}