import { AppConfig } from '@/utils/AppConfig';

const Logo = () => (
  <div className="flex items-center text-xl font-semibold">
    <svg
      className="mr-1 size-8 stroke-current stroke-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 1024"
    >
      <path
        fill="url(#a)"
        d="M18.752 68.106c.09 14.03 11.384 25.315 33.972 47.884 9.73 9.722 14.596 14.584 20.765 17.163l.2.083c6.186 2.54 13.053 2.54 26.786 2.54h563.149c.622 0 1.13 0 1.565-.01 1.854.01 3.855.01 6.028.01h79.994c13.734 0 20.6 0 26.786-2.54l.2-.083c6.169-2.579 11.034-7.441 20.765-17.163 22.588-22.57 33.882-33.854 33.972-47.884l.001-.246-.001-.19c-.09-14.03-11.384-25.315-33.972-47.884-9.731-9.723-14.596-14.584-20.765-17.163l-.2-.083C771.811 0 764.945 0 751.211 0h-79.994c-2.173 0-4.174 0-6.028.01-.435-.01-.943-.01-1.565-.01H100.475c-13.733 0-20.6 0-26.785 2.54l-.2.083c-6.17 2.58-11.035 7.44-20.766 17.163C30.136 42.355 18.842 53.64 18.752 67.67v.437Z"
      />
      <path
        fill="url(#b)"
        d="M30.17 286.345c1.737-15.926 14.298-28.489 30.179-30.182l285.783-30.48c32.23-3.437 50.496 36.045 27.074 58.522L210.789 440.063 57.636 588.984c-22.85 22.218-60.878 3.552-57.415-28.183L30.17 286.345Z"
      />
      <path
        fill="url(#c)"
        d="M70.4 696.296c-16.233 14.189-15.383 39.755 1.756 52.828l351.176 267.856c22.506 17.17 54.845.86 54.532-27.505l-3.079-278.73-.3-292.804c-.03-29.232-34.322-44.865-56.29-25.662L70.4 696.296Z"
      />
      <path
        fill="url(#d)"
        d="M905.942 669.102c14.502 12.955 15.249 35.448 1.639 49.342L642.795 988.769c-21.246 21.691-58.024 6.724-58.203-23.686l-1.548-262.012-3.609-249.173c-.429-29.654 34.485-45.671 56.562-25.949l269.945 241.153Z"
      />
      <path
        fill="url(#e)"
        d="M999.784 286.781c-1.277-16.729-14.5-30.036-31.17-31.371l-301.096-24.109c-31.211-2.499-48.89 35.095-27.12 57.672l158.896 164.788 166.141 174.733c22.041 23.182 60.895 5.815 58.455-26.129l-24.106-315.584Z"
      />
      <defs>
        <linearGradient
          id="a"
          x1="512"
          x2="512"
          y1="0"
          y2="1024"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C84700" />
          <stop offset=".4" stopColor="#BF4126" />
          <stop offset=".604" stopColor="#2A0B0A" />
          <stop offset="1" stopColor="#010B02" />
        </linearGradient>
        <linearGradient
          id="b"
          x1="512"
          x2="512"
          y1="0"
          y2="1024"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C84700" />
          <stop offset=".4" stopColor="#BF4126" />
          <stop offset=".604" stopColor="#2A0B0A" />
          <stop offset="1" stopColor="#010B02" />
        </linearGradient>
        <linearGradient
          id="c"
          x1="512"
          x2="512"
          y1="0"
          y2="1024"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C84700" />
          <stop offset=".4" stopColor="#BF4126" />
          <stop offset=".604" stopColor="#2A0B0A" />
          <stop offset="1" stopColor="#010B02" />
        </linearGradient>
        <linearGradient
          id="d"
          x1="512"
          x2="512"
          y1="0"
          y2="1024"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C84700" />
          <stop offset=".4" stopColor="#BF4126" />
          <stop offset=".604" stopColor="#2A0B0A" />
          <stop offset="1" stopColor="#010B02" />
        </linearGradient>
        <linearGradient
          id="e"
          x1="512"
          x2="512"
          y1="0"
          y2="1024"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C84700" />
          <stop offset=".4" stopColor="#BF4126" />
          <stop offset=".604" stopColor="#2A0B0A" />
          <stop offset="1" stopColor="#010B02" />
        </linearGradient>
      </defs>
    </svg>
    {AppConfig.name}
  </div>
);

export { Logo };
