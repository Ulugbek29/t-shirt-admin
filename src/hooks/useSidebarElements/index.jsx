import { useMemo } from "react";
import { useSelector } from "react-redux";
import { elements } from "./elements";

const useSidebarElements = () => {
  const constructorElements = useSelector(
    (state) => state.constructorTable.list
  );

  const computedElements = useMemo(() => {
    // const computedConstructorElements = constructorElements
    //   .filter((el) => el.show_in_menu)
    //   .map((el) => ({
    //     ...el,
    //     title: el.label,
    //     path: `/object/${el.slug}`,
    //   }));

    return [...elements];
  }, [constructorElements]);

  return { elements: computedElements ?? [] };
};

export default useSidebarElements;
