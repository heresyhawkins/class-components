import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePaginationFromUrl } from './usePaginationForm';

const mockPushState = vi.fn();
const mockReplaceState = vi.fn();
const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;

const originalLocation = window.location;

beforeEach(() => {
  window.history.pushState = mockPushState;
  window.history.replaceState = mockReplaceState;

  mockPushState.mockClear();
  mockReplaceState.mockClear();

  const locationMock = new URL('https://example.com');
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      ...originalLocation,
      href: locationMock.href,
      origin: locationMock.origin,
      protocol: locationMock.protocol,
      host: locationMock.host,
      hostname: locationMock.hostname,
      port: locationMock.port,
      pathname: '/',
      search: '',
      hash: '',
      assign: vi.fn(),
      replace: vi.fn(),
      reload: vi.fn(),
    },
  });
});

afterEach(() => {
  window.history.pushState = originalPushState;
  window.history.replaceState = originalReplaceState;

  vi.clearAllMocks();
  Object.defineProperty(window, 'location', {
    writable: false,
    value: originalLocation,
  });
});

describe('usePaginationFromUrl', () => {
  it('initializes page from URL parameter', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '?page=3',
        pathname: '/',
      },
    });

    const { result } = renderHook(() => usePaginationFromUrl());

    expect(result.current.page).toBe(3);
  });

  it('defaults to page 1 if no page parameter is present', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '',
        pathname: '/',
      },
    });

    const { result } = renderHook(() => usePaginationFromUrl());

    expect(result.current.page).toBe(1);
  });

  it('defaults to page 1 if page parameter is not a number', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '?page=abc',
        pathname: '/',
      },
    });

    const { result } = renderHook(() => usePaginationFromUrl());

    expect(result.current.page).toBe(1);
  });

  it('defaults to page 1 if page parameter is less than 1', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '?page=-5',
        pathname: '/',
      },
    });

    const { result } = renderHook(() => usePaginationFromUrl());

    expect(result.current.page).toBe(1);
  });

  it('updates URL and state when updatePage is called with valid page', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '',
        pathname: '/test',
      },
    });

    const { result } = renderHook(() => usePaginationFromUrl());

    act(() => {
      result.current.updatePage(2);
    });

    expect(result.current.page).toBe(2);
    expect(mockReplaceState).toHaveBeenCalledWith(
      {},
      '',
      '/test?page=2'
    );
  });
});