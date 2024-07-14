import create from 'zustand';

interface PriceState {
  price: number;
  productIndex: number;
  setPrice: (newPrice: number) => void;
  setProductIndex: (index: number) => void;
}

const usePriceStore = create<PriceState>((set) => ({
  price: 0,
  productIndex: 0,
  setPrice: (newPrice) => set({ price: newPrice }),
  setProductIndex: (index) => set({ productIndex: index }),
}));

export default usePriceStore;
