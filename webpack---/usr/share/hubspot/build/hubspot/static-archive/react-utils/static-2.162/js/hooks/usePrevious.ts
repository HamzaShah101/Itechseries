import { useEffect, useRef } from 'react'; // Straight from https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state

export default function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}