export const queryParams = (link: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    const url = `${link}?${currentParams.toString()}`;

    return url;
}