import { Recipe } from '../../types/recipe';
import css from './RecipeDetails.module.css';
import Image from 'next/image';
import SaveButton from '../SaveButton/SaveButton';

interface RecipeDetailsProps {
  data: Recipe;
}

export default function RecipeDetails({ data }: RecipeDetailsProps) {
  return (
    <section className={css.recipeDetailsSection}>
      <div className={css.containerRecipe}>
        <div className={css.titleBlok}>
          <h1 className={css.title}>{data.title}</h1>
          <Image
            className={css.thumb}
            src={data.thumb}
            alt={data.title}
            width={1226}
            height={624}
            sizes="(max-width: 768px) 361px, (max-width: 1440px) 704px, 1226px"
            priority
            
          />
        </div>
        <div className={css.describe}>
          <div className={css.infoBlok}>
            <div className={css.textBlok}>
              <h2 className={`${css.subTitle} ${css.generalInfo}`}>General informations</h2>
              <p className={css.text}>
                <span className={css.textSpan}>Category: </span>
                {data.category}
              </p>
              <p className={css.text}>
                <span className={css.textSpan}>Cooking time: </span>
                {data.time} minutes
              </p>

              <p className={css.text}>
                <span className={css.textSpan}>Caloric content: </span>
                {data.calories
                  ? `Approximately ${data.calories} kcal per serving`
                  : 'N/A'}
              </p>
            </div>

            <SaveButton
              recipeId={data._id}
              variant="wide"
              className={css.saveButton}
            />
          </div>
          <div className={css.recipeBlok}>
            <div>
              <h2 className={css.subTitle}>About recipe</h2>
              <p className={css.text}>{data.description}</p>
            </div>
            <div>
              <h2 className={css.subTitle}>Ingredients:</h2>


              <ul className={css.ingredientsList}>
                {data.ingredients.map((ingredient, index) => (
                  <li key={index} className={css.recipeIngredient}>
                    <p className={css.text}>
                      {ingredient.name} — {ingredient.measure}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={`${css.subTitle} ${css.steps}`}>Preparation Steps:</h2>
              {data.instructions.split(/\r?\n/).filter (Boolean).map((step, index) => (
                <p className={css.text} key={index} style={{ marginBottom: '1em' }}>
                  {step}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}