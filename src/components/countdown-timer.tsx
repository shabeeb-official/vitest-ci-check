import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { View } from "@/pages/View";
import CircularProgress from "./circular-progress";

const CountDownTimer = ({
  countDownInMilliseconds,
  handleChangeView,
}: {
  countDownInMilliseconds: number;
  handleChangeView: (view: View) => void;
}) => {
  const [timer, setTimer] = useState<number>(0);
  const interval = useRef(null);

  if (timer === countDownInMilliseconds && timer > 0) {
    clearInterval(interval.current);
    handleChangeView("products");
  }

  useEffect(() => {
    if (countDownInMilliseconds === 0) {
      setTimer(0);
      clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(() => {
      setTimer((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval.current);
  }, [countDownInMilliseconds]);

  if (countDownInMilliseconds === 0) return null;

  return (
    <div className="bg-white px-10 py-7">
      <div className="flex justify-center pb-4">
        <p>You will be redirected to products page in</p>
      </div>
      <div className="flex justify-center p-100">
        <CircularProgress
          counter={countDownInMilliseconds - timer}
          total={countDownInMilliseconds}
        />
      </div>

      <div className="flex justify-between pt-5">
        <Button onClick={() => handleChangeView("chat")} className="capitalize">
          stay here
        </Button>
        <Button
          variant="outline"
          onClick={() => handleChangeView("products")}
          className="capitalize"
        >
          Go to Products Page
        </Button>
      </div>
    </div>
  );
};

export default CountDownTimer;
