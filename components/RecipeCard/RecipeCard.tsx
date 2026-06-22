import Image from 'next/image';
import Link from 'next/link';
import SaveButton from '../SaveButton/SaveButton';

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
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md h-full">
      {/* Кнопка збереження */}
      <div className="absolute right-4 top-4 z-10">
        <SaveButton recipeId={id} isFavoriteInitial={isFavorite} />
      </div>

      {/* Зображення */}
      <div className="relative h-52 w-full bg-gray-50">
        {thumb ? (
          <Image
            src={thumb}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400 bg-gray-100">
            Немає фото
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="flex flex-col flex-grow p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-gray-900 mb-2">
          {title}
        </h3>

        <p className="line-clamp-2 text-sm text-gray-600 mb-5 flex-grow">
          {description}
        </p>

        {/* Блок з іконками часу та калорій */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {/* Час приготування */}
          <div className="flex items-center gap-1.5">
            <Image src="/icons/clock.svg" alt="Clock" width={16} height={16} />
            <span>{time} хв</span>
          </div>

          {/* Калорії */}
          <div className="flex items-center gap-1.5">
            <Image src="/icons/flame.svg" alt="Flame" width={16} height={16} />
            <span>{calories ? `${calories} ккал` : '—'}</span>
          </div>
        </div>

        {/* Кнопка детальніше  */}
        <Link
          href={`/recipes/${id}`}
          className="mt-auto block text-center bg-green-600 text-white font-medium py-2.5 px-4 rounded-xl hover:bg-green-700 transition-colors text-sm shadow-sm"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}
