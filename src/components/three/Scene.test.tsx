import { page } from '@vitest/browser/context';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import ThreeSceneR3F from './Scene';

// Mock the custom hook to provide deterministic trailerDimensions
vi.mock('@/hooks/useCanvasSettings', () => ({
  useCanvasSettings: () => ({
    trailerDimensions: { length: 1200, width: 250, height: 300 },
  }),
}));

// Mock @react-three/fiber to render children as plain DOM nodes and provide minimal useThree
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({
    camera: { fov: 45, position: { length: () => 20 } },
    size: { height: 800 },
  }),
}));

// Mock @react-three/drei Grid/OrbitControls and useGLTF (used by TruckModel)
vi.mock('@react-three/drei', () => ({
  Grid: (props: any) => <div data-testid="grid" {...props} />,
  OrbitControls: (props: any) => <div data-testid="orbit-controls" {...props} />,
  useGLTF: vi.fn(() => ({ scene: { id: 'mock-scene' } })),
}));

// Mock postprocessing so effects don't break tests
vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: any) => <div data-testid="composer">{children}</div>,
  Bloom: ({ children }: any) => <div data-testid="bloom">{children}</div>,
}));

// Mock MUI pieces used by the component so useTheme doesn't require a provider
vi.mock('@mui/material', () => ({
  Box: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  Link: ({ children, ...rest }: any) => <a {...rest}>{children}</a>,
  Typography: ({ children, ...rest }: any) => <span {...rest}>{children}</span>,
  useTheme: () => ({ mixins: { toolbar: { minHeight: 64 } } }),
}));

describe('ThreeSceneR3F', () => {
  it('renders Canvas, default ScaleBar text and credits link', () => {
    render(<ThreeSceneR3F />);

    // Canvas is mocked to render children
    expect(page.getByTestId('canvas').elements()).toHaveLength(1);

    // Default ScaleBar meters state is 1 -> "1 m" should be present
    expect(page.getByText(/1\s*m/).elements()).toHaveLength(1);

    // Credits link should render with the model name
    expect(page.getByText(/Volvo FH 460/).elements()).toHaveLength(1);

    // Grid and OrbitControls are mocked and should exist
    expect(page.getByTestId('grid').elements()).toHaveLength(1);
    expect(page.getByTestId('orbit-controls').elements()).toHaveLength(1);
  });
});
