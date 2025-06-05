import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({ name: 'HRM' })
  .useReactNative()
  .connect();

console.tron = Reactotron;

declare global {
  interface Console {
    tron: typeof import('reactotron-react-native').default;
  }
}

export default Reactotron;
