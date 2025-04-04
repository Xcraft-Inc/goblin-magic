export function getPlatform(ua) {
  if (!ua) {
    return null;
  }
  ua = ua.toLowerCase();
  if (ua.includes('linux')) {
    return 'linux';
  }
  if (ua.includes('windows')) {
    return 'windows';
  }
  if (ua.includes('mac os')) {
    return 'macos';
  }
  return null;
}

export default function getModifiers(event) {
  const platform = getPlatform(navigator.userAgent);
  if (platform === 'macos') {
    return {
      shiftKey: event.shiftKey,
      ctrlKey: event.metaKey,
      altKey: event.altKey,
      metaKey: event.ctrlKey,
    };
  }
  return {
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    altKey: event.altKey,
    metaKey: event.metaKey,
  };
}
