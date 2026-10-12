import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PATHS } from "@/paths";
import { startTransition } from "react";

const categoryButtons = {
  men: [
    "Shorts",
    "Sneakers",
    "Swim Wear",
    "Shirts",
    "Autumn",
    "Beach",
    "Concert",
    "F1 Outfits",
  ],
  women: [
    "Sets",
    "Beachwear",
    "Sandals",
    "Tops",
    "Concert",
    "Festival",
    "Matching",
    "Tik Tok Trends",
  ],
  kids: [
    "Boys Outerwear",
    "Boys Sneakers",
    "Boys Shorts",
    "Boys Tops",
    "Girls Sneakers",
    "Girls Slides",
    "Girls Dresses",
    "Girls Accessories",
  ],
  boardsports: [
    "Skateboarding",
    "Surfing",
    "RollerSkating",
    "Bodyboarding",
    "Scooter",
    "Skimboarding",
    "Snowboarding",
    "Wakeboarding",
  ],
};

const CategoryCards = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    startTransition(() => {
      navigate(PATHS.products.root, {
        state: {
          selectedCategory: category,
          fromButton: true,
        },
      });
    });
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center mt-8">
        Let's Style You
      </h2>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Discover your perfect style with our personal shopping assistant.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CardItem
          list={categoryButtons.men}
          label="Men's Style"
          handleClick={handleCategoryClick}
        />
        <CardItem
          list={categoryButtons.women}
          label="Women's Style"
          handleClick={handleCategoryClick}
        />
        <CardItem
          list={categoryButtons.kids}
          label="Kid's Style"
          handleClick={handleCategoryClick}
        />
        <CardItem
          list={categoryButtons.boardsports}
          label="Boardsports"
          handleClick={handleCategoryClick}
        />
      </div>
    </>
  );
};

const CardItem = ({
  list = [],
  label = "",
  handleClick,
}: {
  list: string[];
  label: string;
  handleClick: (category: string) => void;
}) => {
  return (
    <Card className="rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">{label}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {list.map((item, index) => (
            <Button
              key={`men-${index}`}
              variant="outline"
              size="sm"
              className="text-sm"
              onClick={() => handleClick(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCards;
