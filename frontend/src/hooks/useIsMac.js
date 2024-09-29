const useIsMac = () => {
    return navigator.userAgent.indexOf('Mac OS X') !== -1;
};

export default useIsMac;